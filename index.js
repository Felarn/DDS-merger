import fs from "fs";
const sample = fs.readFileSync("fixtures/00_foundation.dds");
// console.log(sample.slice(0, 128));

const file = {
  buffer: sample,
  pointer: 0,
  getNextDWORD() {
    const out = this.buffer.readUInt32LE(this.pointer);
    this.pointer += 4;
    return out;
  },
};

// for (let i = 0; i < 128 / 4; i++) {
//   console.log(file.getNextDWORD());
// }

const DDS = [
  ["DWORD", "dwMagic"],
  ["DDS_HEADER", "header"],
];

const DDS_HEADER = [
  ["DWORD", "dwSize"],
  ["DWORD", "dwFlags"],
  ["DWORD", "dwHeight"],
  ["DWORD", "dwWidth"],
  ["DWORD", "dwPitchOrLinearSize"],
  ["DWORD", "dwDepth"],
  ["DWORD", "dwMipMapCount"],
  ["DWORD", "dwReserved1[11]"],
  ["DDS_PIXELFORMAT", "ddspf"],
  ["DWORD", "dwCaps"],
  ["DWORD", "dwCaps2"],
  ["DWORD", "dwCaps3"],
  ["DWORD", "dwCaps4"],
  ["DWORD", "dwReserved2"],
];

const DDS_PIXELFORMAT = [
  ["DWORD", "dwSize"],
  ["DWORD", "dwFlags"],
  ["DWORD", "dwFourCC"],
  ["DWORD", "dwRGBBitCount"],
  ["DWORD", "dwRBitMask"],
  ["DWORD", "dwGBitMask"],
  ["DWORD", "dwBBitMask"],
  ["DWORD", "dwABitMask"],
];

const formats = { DDS, DDS_HEADER, DDS_PIXELFORMAT };

const parseHead = (data, format) =>
  format.reduce((parsedData, [type, name]) => {
    console.log(type, name);
    if (type === "DWORD") {
      if (name.match(/\[\d+\]$/)) {
        const arrLength = Number(name.match(/\[(\d+)\]$/)[1]);
        const arrName = name.match(/(.+)\[\d+\]$/)[1];
        parsedData[arrName] = Array(arrLength)
          .fill(null)
          .map(() => data.getNextDWORD());
        return parsedData;
      }
      parsedData[name] = data.getNextDWORD();
      return parsedData;
    }
    parsedData[name] = parseHead(data, formats[type]);
    return parsedData;
  }, {});
const head = parseHead(file, formats.DDS);
console.log(head);
console.log(file.pointer);
const readHeader = (data) => {};

const getPixelData = (data, head) => {
  const width = head.header.dwWidth;
  const hight = head.header.dwHeight;
};
