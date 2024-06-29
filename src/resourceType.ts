export enum ResourceEnum {
  Wood,
  Brick,
  Sheep,
  Wheat,
  Ore,
  Desert,
}

export function ResourceColor(resource: ResourceEnum) {
  switch (resource) {
    case ResourceEnum.Wood:
      return 0x228b22;
    case ResourceEnum.Brick:
      return 0xb22222;
    case ResourceEnum.Sheep:
      return 0x98fb98;
    case ResourceEnum.Wheat:
      return 0xffd700;
    case ResourceEnum.Ore:
      return 0x708090;
    case ResourceEnum.Desert:
      return 0xf0e68c;
  }
}