const cookieExtractor = (req) => req.cookies?.token || null;

export default cookieExtractor;