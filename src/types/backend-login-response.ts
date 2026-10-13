export type BackendLoginResponse = {
  success: boolean;
  data: {
    id: string;
    name: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
};