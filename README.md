# Nitro Imager

This tool serves as a server-side habbo-imager using the same avatar generator from nitro-renderer. It will download & cache in memory `.nitro` assets. Rendered figures will also save to a local folder to prevent re-renders. You will use the same process as your nitro-client to update assets for the imager.

## Configuration

First you should copy `.env.example` to `.env` then set your configuration. Additional options can be found in `config.json`

Your figuredata, figuremap, effectmap, & HabboAvatarActions can safely point to a remote URL without worrying about performance.

You should set all download urls to local absolute paths on your system, this will allow for faster downloading of figures. However, you may point to remote urls as well.

You must also set an absolute path to a location where rendered figures can save to. This can be a private folder that is not accessible from the web.

## Running the server

Requires **Node.js 22+**.

**Make sure you run `npm i` before first use.** This also builds the native `sharp` (WebP) and `canvas` modules, so a working build toolchain is required.

You must compile the server by running `npm run build`

To start the server you must run `npm start`

> When deploying compiled output (`dist/`) to another machine, run `npm i` there too — `sharp` and `canvas` ship native binaries that must be installed on the target.

The server will run on the desired host & port as set in the config. You must setup a reverse proxy on your server to make the imager publicly accessible.

NGINX Example

    server {
    	listen 80;
    	listen [::]:80;

    	listen 443;
    	listen [::]:443;

    	server_name habbo-imaging.website.com;

    	location / {
    		proxy_pass              http://localhost:1338;
    		proxy_set_header        Host $host;
    		proxy_set_header        X-Real-IP $remote_addr;
    		proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
    	}
    }

IIS Example (requires the URL Rewrite & Application Request Routing modules). See `web.config`:

    <?xml version="1.0" encoding="UTF-8"?>
    <configuration>
        <system.webServer>
            <rewrite>
                <rules>
                    <rule name="ReverseProxyInboundRule1" stopProcessing="true">
                        <match url="(.*)" />
                        <action type="Rewrite" url="http://localhost:3030/{R:1}" />
                    </rule>
                </rules>
            </rewrite>
        </system.webServer>
    </configuration>

## URL paramaters

Their are a few different options you may pass as URL parameters to generate figures with different actions. All parameters are optional.

| key            | default | description                                                         |
| -------------- | ------- | ------------------------------------------------------------------- |
| figure         | null    | The figure string to be rendered                                    |
| action         | null    | The actions to render, see actions below                            |
| gesture        | std     | The gesture to render, see gestures below                           |
| direction      | 2       | The direction to render, from 0-7                                   |
| head_direction | 2       | The head direction to render, from 0-7                              |
| headonly       | 0       | A value of `0` or `1`                                               |
| dance          | 0       | A dance id of 0-4 to render                                         |
| effect         | 0       | An effect id to render                                              |
| size           | n       | The size to render, see sizes below                                 |
| frame_num      | 0       | The frame number to render                                          |
| img_format     | auto    | `png`, `gif`, `apng`, or `webp`. Default is smart: `webp` for effects, `gif` for animated actions/dances, `png` otherwise. `apng`/`webp` support full alpha (effects). Explicit value always overrides |

## Image Formats

| format | animated | alpha       | notes                                                        |
| ------ | -------- | ----------- | ------------------------------------------------------------ |
| png    | no       | full        | default for static figures                                   |
| gif    | yes      | 1-bit       | default for animated actions/dances; soft alpha not supported|
| apng   | yes      | full 8-bit  | lossless; saved as a `.png` file (APNG is a PNG container)   |
| webp   | yes      | full 8-bit  | lossless; default for effects; smaller than gif              |

The format is chosen automatically (see `img_format` above) but can always be forced with `&img_format=`. Effects use soft alpha (glows/shadows), so they default to `webp`; force `gif` only if you need maximum client compatibility.

## Actions

You may render multiple actions with a comma separater

Example: `&action=wlk,wav,drk=1`

##### Posture

| key    | description                  |
| ------ | ---------------------------- |
| std    | Renders the standing posture |
| wlk,mv | Renders the walking posture  |
| sit    | Renders the sitting posture  |
| lay    | Renders the laying posture   |

##### Expression

| key      | description                     |
| -------- | ------------------------------- |
| wav,wave | Renders the waving expression   |
| blow     | Renders the kissing expression  |
| laugh    | Renders the laughing expression |
| respect  | Renders the respect expression  |

##### Custom

| key          | description                                                  |
| ------------ | ------------------------------------------------------------ |
| sixseven, 67 | Renders the "67" meme gesture (animated, defaults to a GIF)  |

##### Carry / Drink

To hold a certain drink, use an equal separator with the hand item id. You can only render one of these options at a time

| key      | description              |
| -------- | ------------------------ |
| crr,cri  | Renders the carry action |
| drk,usei | Renders the drink action |

## Gestures

| key | description                    |
| --- | ------------------------------ |
| std | Renders the standard gesture   |
| agr | Renders the aggravated gesture |
| sad | Renders the sad gesture        |
| sml | Renders the smile gesture      |
| srp | Renders the surprised gesture  |

## Sizes

| key | description                  |
| --- | ---------------------------- |
| s   | Renders the small size (0.5) |
| n   | Renders the normal size (1)  |
| l   | Renders the large size (2)   |

## Known Issues

-   GIFs are only able to render 1 bit alpha channels, so effects using soft alpha (glows/shadows) will not render correctly as a GIF. Use `img_format=apng` or `img_format=webp` for full alpha; effects default to `webp` automatically.
-   The rendered canvas size may not match habbos imager exactly, we will hopefully have this addressed soon.
