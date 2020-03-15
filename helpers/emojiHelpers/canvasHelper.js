"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emoji = require("node-emoji");
const fs = require("fs");
const path = require("path");
const canvas = require("canvas")


class CanvasEmoji {
    constructor() {
        const canvas_1 = canvas.createCanvas(150, 50);
        const ctx = canvas_1.getContext('2d');        
        this.canvasCtx = ctx;
    }
    getEmojiKeys(str) {
        const emojiArr = [];
        emoji.replace(str, (item) => {
            emojiArr.push(`${item.key}`);
        });
        return emojiArr;
    }
    replaceEmojiToEmojiName(str) {
        const emojiArr = [];
        str = emoji.replace(str, (item) => {
            emojiArr.push(`{${item.key}}`);
            return `{${item.key}}`;
        });
        return {
            str,
            emojiArr
        };
    }
    drawPngReplaceEmoji(data) {
        const { canvasCtx } = this;
        const { fillStyle, font, y, emojiW, emojiH } = data;
        let { text, x, length } = data;
        canvasCtx.fillStyle = fillStyle;
        canvasCtx.font = font;
        const emojiArr = [];
        text = emoji.replace(text, (item) => {
            emojiArr.push(`{${item.key}}`);
            return `{${item.key}}`;
        });
        let ctxText;
        let i = 0;
        for (const emojiItem of emojiArr) {
            const index = text.indexOf(emojiItem);
            if (length !== -1 && length - text.substring(0, index).length <= 0) {
                canvasCtx.fillText(`${text.substring(0, length)}...`, x, y);
                ctxText = this.canvasCtx.measureText(`${text.substring(0, length)}...`);
                x += ctxText.width;
                break;
            }
            canvasCtx.fillText(text.substring(0, index), x, y);
            ctxText = canvasCtx.measureText(text.substring(0, index));
            x += ctxText.width;
            const emojiImg = new canvas.Image();
            emojiImg.src = fs.readFileSync(path.join(__dirname, `../emoji_pngs/${emojiItem.replace("{", "").replace("}", "")}.png`));
            canvasCtx.drawImage(emojiImg, x, y - (5 / 6) * emojiH, emojiW, emojiH);
            x += emojiW;
            text = text.substr(index + emojiItem.length);
            i++;
            if (i === emojiArr.length) {
                canvasCtx.fillText(text, x, y);
                ctxText = canvasCtx.measureText(text);
                x += ctxText.width;
            }
            if (length !== -1) {
                length -= text.substring(0, index).length + 1;
                if (length === 0) {
                    canvasCtx.fillText("...", x, y);
                    ctxText = canvasCtx.measureText("...");
                    x += ctxText.width;
                    break;
                }
            }
        }
        if (emojiArr.length === 0) {
            if (length) {
                text = this.showText(text, length);
            }
            canvasCtx.fillText(text, x, y);
            const ctxText = canvasCtx.measureText(text);
            x += ctxText.width;
        }
        return canvasCtx;
    }
    showText(text, length = 10) {
        if (text.length > length) {
            return text.slice(0, length) + "...";
        }
        else {
            return text;
        }
    }
}
exports.CanvasEmoji = CanvasEmoji;
//# sourceMappingURL=index.js.map