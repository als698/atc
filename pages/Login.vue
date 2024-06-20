<script lang="ts" setup>
import { type Ref, ref } from "vue";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { auth } from "../src/utils/Firebase";

const email = ref("");
const password = ref("");
const error: Ref<string | null> = ref(null);

const login = async () => {
  error.value = null;

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);

    navigateTo("/");
  } catch (e: any) {
    if (
      e.code === "auth/wrong-password" ||
      e.code === "auth/invalid-credential"
    ) {
      error.value = "Invalid credentials.";
    } else {
      error.value = "An error occurred.";
    }
  }
};

onMounted(() => {});
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8"
  >
    <div class="w-full max-w-md space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="login">
        <input name="remember" type="hidden" value="true" />
        <div class="-space-y-px rounded-md shadow-sm">
          <div>
            <label class="sr-only" for="email-address">Email address</label>
            <input
              id="email-address"
              v-model="email"
              autocomplete="email"
              class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              name="email"
              placeholder="Email address"
              required
              type="email"
            />
          </div>
          <div>
            <label class="sr-only" for="password">Password</label>
            <input
              id="password"
              v-model="password"
              autocomplete="current-password"
              class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              name="password"
              placeholder="Password"
              required
              type="password"
            />
          </div>
        </div>

        <div>
          <button
            class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            type="submit"
          >
            Sign in
          </button>
        </div>

        <div v-if="error" class="text-red-500">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
