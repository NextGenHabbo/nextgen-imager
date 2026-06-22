import { Canvas, createCanvas } from "canvas";
import { Request, Response } from "express";
import { writeFile } from "fs";
const sharp = require("sharp");
const GIFEncoder = require("gif-encoder-2");
const UPNG = require("upng-js");

const FRAME_DELAY_MS = 120;
import { File, FileUtilities, Point } from "../../../../core";
import { Application } from "../../../Application";
import { AvatarScaleType, IAvatarImage } from "../../../avatar";
import {
  BuildFigureOptionsRequest,
  BuildFigureOptionsStringRequest,
  ProcessActionRequest,
  ProcessDanceRequest,
  ProcessDirectionRequest,
  ProcessEffectRequest,
  ProcessGestureRequest,
  RequestQuery,
} from "./utils";

export const HabboImagingRouterGet = async (
  request: Request<any, any, any, RequestQuery>,
  response: Response,
) => {
  const query = request.query;

  if (!query.figure || !query.figure.trim().length) {
    response.redirect(302, 'https://nextgenhabbo.com');
    return;
  }

  try {
    const buildOptions = BuildFigureOptionsRequest(query);
    const saveDirectory = process.env.AVATAR_SAVE_PATH as string;
    const directory = FileUtilities.getDirectory(saveDirectory);
    const avatarString = BuildFigureOptionsStringRequest(buildOptions);
    const saveFile = new File(
      `${directory.path}/${avatarString}.${buildOptions.imageFormat}`,
    );

    if (saveFile.exists()) {
      const buffer = await FileUtilities.readFileAsBuffer(saveFile.path);

      if (buffer) {
        response
          .writeHead(200, {
            "Content-Type": ContentTypeForFormat(buildOptions.imageFormat),
            "Content-Disposition": `inline; filename="${avatarString}.${FileExtForFormat(buildOptions.imageFormat)}"`,
          })
          .end(buffer);
      }

      return;
    }

    if (buildOptions.effect > 0) {
      if (!Application.instance.avatar.effectManager.isAvatarEffectReady(buildOptions.effect)) {
        await Application.instance.avatar.effectManager.downloadAvatarEffect(buildOptions.effect);
      }
    }

    const avatar = await Application.instance.avatar.createAvatarImage(
      buildOptions.figure,
      AvatarScaleType.LARGE,
      "M",
    );
    const avatarCanvas = Application.instance.avatar.structure.getCanvas(
      avatar.getScale(),
      avatar.mainAction.definition.geometryType,
    );

    avatar.initActionAppends();
    ProcessActionRequest(query, avatar);
    ProcessGestureRequest(query, avatar);
    ProcessDanceRequest(query, avatar);
    ProcessEffectRequest(query, avatar);
    avatar.endActionAppends();
    ProcessDirectionRequest(query, avatar);

    const tempCanvas = createCanvas(
      avatarCanvas.width * buildOptions.size,
      avatarCanvas.height * buildOptions.size,
    );
    const tempCtx = tempCanvas.getContext("2d");

    if (buildOptions.frameNumber > 0) {
      avatar.updateAnimationByFrames(buildOptions.frameNumber);
    }

    const format = buildOptions.imageFormat;
    const isGif = format === "gif";
    const isApng = format === "apng";
    const isWebp = format === "webp";
    const isAnimated = isGif || isApng || isWebp;
    const totalFrames = isAnimated ? Math.max(avatar.getTotalFrameCount(), 1) : 1;

    let encoder: any = null;
    let gifChunks: Buffer[] = [];
    let gifStreamEnd: Promise<void> | null = null;
    const apngFrames: ArrayBuffer[] = [];
    const webpFrames: Buffer[] = [];

    if (isGif) {
      encoder = new GIFEncoder(tempCanvas.width, tempCanvas.height);
      const stream = encoder.createReadStream();
      stream.on("data", (chunk: Buffer) => gifChunks.push(chunk));
      gifStreamEnd = new Promise<void>((resolve) => stream.on("end", resolve));
      encoder.start();
      encoder.setRepeat(0);
      encoder.setDelay(FRAME_DELAY_MS);
      encoder.setQuality(10);
      encoder.setTransparent(0xFF00FF);
    }

    for (let i = 0; i < totalFrames; i++) {
      tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

      if (i > 0) avatar.updateAnimationByFrames(1);

      const canvas = await avatar.getImage(buildOptions.setType, 0, false, buildOptions.size);

      const avatarOffset = new Point();
      const canvasOffset = new Point();

      canvasOffset.x = (tempCanvas.width - canvas.width) / 2;
      canvasOffset.y = (tempCanvas.height - canvas.height) / 2;

      for (const sprite of avatar.getSprites()) {
        if (sprite.id === "avatar") {
          const layerData = avatar.getLayerData(sprite);
          avatarOffset.x = sprite.getDirectionOffsetX(buildOptions.direction);
          avatarOffset.y = sprite.getDirectionOffsetY(buildOptions.direction);
          if (layerData) {
            avatarOffset.x += layerData.dx;
            avatarOffset.y += layerData.dy;
          }
        }
      }

      const avatarSize = 64;
      const sizeOffset = new Point(
        (canvas.width - avatarSize) / 2,
        canvas.height - avatarSize / 4,
      );

      ProcessAvatarSprites(tempCanvas, avatar, avatarOffset, canvasOffset.add(sizeOffset), false);
      tempCtx.drawImage(canvas, avatarOffset.x, avatarOffset.y, canvas.width, canvas.height);
      ProcessAvatarSprites(tempCanvas, avatar, avatarOffset, canvasOffset.add(sizeOffset), true);

      if (isGif && encoder) {
        encoder.addFrame(tempCtx);
      } else if (isApng) {
        const data = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;
        // copy: getImageData buffer is reused-safe but slice to detach
        apngFrames.push(data.slice().buffer);
      } else if (isWebp) {
        webpFrames.push(tempCanvas.toBuffer("image/png"));
      }
    }

    let outBuffer: Buffer;

    if (isGif && encoder) {
      encoder.finish();
      await gifStreamEnd;
      outBuffer = Buffer.concat(gifChunks);
    } else if (isApng) {
      const delays = new Array(apngFrames.length).fill(FRAME_DELAY_MS);
      // cnum=0 => lossless, full 8-bit alpha
      outBuffer = Buffer.from(UPNG.encode(apngFrames, tempCanvas.width, tempCanvas.height, 0, delays));
    } else if (isWebp) {
      if (webpFrames.length > 1) {
        const delays = new Array(webpFrames.length).fill(FRAME_DELAY_MS);
        outBuffer = await sharp(webpFrames, { join: { animated: true } })
          .webp({ loop: 0, delay: delays, lossless: true })
          .toBuffer();
      } else {
        // single frame: static webp (join requires >= 2 images)
        outBuffer = await sharp(webpFrames[0]).webp({ lossless: true }).toBuffer();
      }
    } else {
      outBuffer = tempCanvas.toBuffer("image/png");
    }

    response
      .writeHead(200, {
        "Content-Type": ContentTypeForFormat(format),
        "Content-Disposition": `inline; filename="${avatarString}.${FileExtForFormat(format)}"`,
      })
      .end(outBuffer);

    writeFile(saveFile.path, outBuffer, () => {});
  } catch (err) {
    Application.instance.logger.error(err.message);
    response.writeHead(500).end();
  }
};

function ContentTypeForFormat(format: string): string {
  switch (format) {
    case "gif": return "image/gif";
    case "webp": return "image/webp";
    case "apng": return "image/apng";
    default: return "image/png";
  }
}

function FileExtForFormat(format: string): string {
  switch (format) {
    case "gif": return "gif";
    case "webp": return "webp";
    case "apng": return "png"; // APNG uses the .png extension
    default: return "png";
  }
}

function ProcessAvatarSprites(
  canvas: Canvas,
  avatar: IAvatarImage,
  avatarOffset: Point,
  canvasOffset: Point,
  frontSprites: boolean = true,
) {
  const ctx = canvas.getContext("2d");

  for (const sprite of avatar.getSprites()) {
    if (sprite.id === "avatar") continue;

    const layerData = avatar.getLayerData(sprite);

    let offsetX = sprite.getDirectionOffsetX(avatar.getDirection());
    let offsetY = sprite.getDirectionOffsetY(avatar.getDirection());
    let offsetZ = sprite.getDirectionOffsetZ(avatar.getDirection());
    let direction = 0;
    let frame = 0;

    if (!frontSprites) {
      if (offsetZ >= 0) continue;
    } else if (offsetZ < 0) continue;

    if (sprite.hasDirections) direction = avatar.getDirection();

    if (layerData) {
      frame = layerData.animationFrame;
      offsetX = offsetX + layerData.dx;
      offsetY = offsetY + layerData.dy;
      direction = direction + layerData.dd;
    }

    if (direction < 0) direction = direction + 8;

    if (direction > 7) direction = direction - 8;

    const assetName =
      avatar.getScale() + "_" + sprite.member + "_" + direction + "_" + frame;
    const asset = avatar.getAsset(assetName);

    if (!asset) continue;

    const texture = asset.texture;

    let x = canvasOffset.x - 1 * asset.offsetX + offsetX;
    let y = canvasOffset.y - 1 * asset.offsetY + offsetY;

    ctx.save();

    if (sprite.ink === 33) ctx.globalCompositeOperation = "lighter";

    ctx.transform(1, 0, 0, 1, x - avatarOffset.x, y - avatarOffset.y);
    ctx.drawImage(texture.drawableCanvas, 0, 0, texture.width, texture.height);

    ctx.restore();
  }
}
