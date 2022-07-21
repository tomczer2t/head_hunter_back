export interface JwtPayload {
  userId: string;
}

export interface JwtPayloadDecoded extends JwtPayload {
  exp: number;
  iat: number;
}
