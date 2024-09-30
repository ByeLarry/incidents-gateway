export interface ITokens {
  accessToken: string;
  refreshToken: IToken;
}

export interface IJwtPayload {
  id: string;
  email: string;
  roles: string[];
}

export interface IToken {
  value: string;
  user: string;
  exp: Date;
  userAgent?: string;
}
