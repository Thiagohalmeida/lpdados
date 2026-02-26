import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    // Auth gate via matcher/callback below.
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/portal/:path*"],
};

