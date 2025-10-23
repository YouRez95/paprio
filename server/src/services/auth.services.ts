import db from "../config/db";
import { INTERNAL_SERVER_ERROR } from "../constants/http";
import appAssert from "../utils/appAssert";

type createUserToDatabaseType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string | null;
};

export default async function createUserToDatabase({
  id,
  email,
  firstName,
  lastName,
  image,
}: createUserToDatabaseType) {
  const { id: prismaId } = await db.user.create({
    data: {
      clerkId: id,
      firstName,
      lastName,
      email,
      imageUrl: image,
    },
  });

  appAssert(prismaId, INTERNAL_SERVER_ERROR, "Error: Could not create user");
  return { created: true };
}
