import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "../src/utils/Firebase";

export default defineNuxtRouteMiddleware(() => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      return navigateTo("/login");
    }
  });
});
