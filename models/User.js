import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    index: { unique: true },
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(user.password, salt);
    next();
  } catch (error) {

    console.error(error); // Cambio de "console.log" a "console.error"
    throw new Error("Fallo en el hash de la contraseña"); // Cambio de "error" a "Error"
  }
});

userSchema.methods.comparePassword = async function(canditatePassword){
  return await bcryptjs.compare(canditatePassword, this.password)
  
}

export const User = mongoose.model("User", userSchema);
