import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      organizationId: string;
    };
  }
  interface User {
    id: string;
    email: string;
    organizationId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid?: string;
    organizationId?: string;
  }
}