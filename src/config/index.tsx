export const DOMAIN =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/"
    : "https://app.checkincaster.xyz/";

export const CheckInPoints = {
  CHECKIN_APP: 10,
  CHECKIN_WARPCAST: 10,
  CHECKIN_POAP: 10,
  CHECKIN_WITH_PHOTO: 10,
  CHECKIN_WITH_VIDEO: 10,
  CHECKIN_FIRST: 10,
  DEGEN_TIP_POINTS: 1,
  CHECKIN_WITH_FRIENDS: 10,
  REFER_FRIENDS: 10,
};

export const AllowedFids = [285089, 4065, 9050, 303561];
