declare global {
  namespace Express {
    interface Request {
      user?: any;
      token?: any;
    }
  }
}