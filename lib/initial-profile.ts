import { currentUser, redirectToSignIn, auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const initialProfile = async () => {
  const user = await currentUser();
  if (!user) {
    return auth().redirectToSignIn();
  }

  const profile = await db.profile.findUnique({
    where: {
      userID: user.id,
    },
  });
  if (profile) {
    return profile;
  }

  const newProfile = await db.profile.create({
    data: {
      userID: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });
  return newProfile;
};
