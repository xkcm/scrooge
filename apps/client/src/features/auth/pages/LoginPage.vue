<template>
  <AuthLayout>
    <template #default>
      <form id="form-container" @on-submit.prevent>
        <h2>Welcome back!</h2>
        <span id="details-info">Log in to your Scrooge account</span>

        <TextInput
          id="mail-input"
          v-model="mail"
          placeholder="yourmail@mail.com"
        >
          <template #icon><MessageIcon /></template>
        </TextInput>

        <PasswordInput
          id="password-input"
          v-model="password"
          placeholder="Your Password"
        >
          <template #icon><KeyIcon /></template>
        </PasswordInput>

        <a id="forgot-password-text" href="#">I forgot my password</a>
        <span v-if="error.isShown" id="error-info">{{ error.message }}</span>

        <FilledButton
          id="submit-button"
          caption="Log in"
          @click="submitForm(mail, password)"
        ></FilledButton>

        <span id="new-account-text">
          You don't have an account? <a href="#">Sign up</a>
        </span>
      </form>
    </template>
  </AuthLayout>
</template>

<script setup lang="ts">
// todo: add form validation
import { useRouter } from "vue-router";
import { reactive, ref } from "vue";

import AuthLayout from "../layouts/AuthLayout.vue";
import apiClient from "@/utils/api-client/api-client";

import TextInput from "@core/components/Inputs/TextInput.vue";
import PasswordInput from "@core/components/Inputs/PasswordInput.vue";
import FilledButton from "@core/components/Buttons/FilledButton.vue";

import MessageIcon from "@icons/Message_light.svg";
import KeyIcon from "@icons/Key_light.svg";
import { ApiError } from "@scrooge/shared";

import { useAuthStore } from "../stores/auth.store";

const mail = ref("");
const password = ref("");
const error = reactive({
  message: "",
  isShown: false,
});

const router = useRouter();
const authStore = useAuthStore();

const submitForm = async (mailValue: string, passwordValue: string) => {
  error.isShown = false;
  try {
    const authState = await apiClient.auth.login(mailValue, passwordValue);
    authStore.setAuthState(authState.isAuthTokenSet);
    router.push("dashboard");
  } catch (apiError) {
    error.message = (apiError as ApiError).message;
    error.isShown = true;
  }
};
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";

#form-container {
  display: flex;
  flex-direction: column;
  margin: auto;
  margin-top: 338px;
  width: 400px;

  #details-info {
    @include utils.useTextColor(alpha, 300);
    margin-left: 5px;
    margin-top: 7px;
    margin-bottom: 11px;
  }

  #password-input {
    margin-top: 17px;
  }

  #password-input,
  #mail-input {
    .input__icon svg {
      color: utils.getColor(delta);
    }
  }

  #forgot-password-text {
    color: utils.getColor(beta);
    display: block;
    align-self: flex-end;
    margin-top: 8px;
    margin-bottom: 8px;
    font-weight: 600;
    font-size: 0.75rem;
    text-decoration: none;

    &:focus-visible {
      @include utils.defaultOutlineOnFocus;
      border-radius: 2px;
    }
  }

  #new-account-text {
    @include utils.useTextColor(alpha, 300);
    margin-top: 32px;
    width: 100%;
    text-align: center;
    position: relative;

    &::before {
      @include utils.useColorSet(alpha, 100);
      content: "";
      position: absolute;
      display: block;
      width: 470px;
      height: 1px;
      top: -16px;
      left: -35px;
    }

    a {
      color: utils.getColor(beta);
      font-family: Poppins;
      font-weight: 600;
      text-decoration: none;

      &:focus-visible {
        @include utils.defaultOutlineOnFocus;
        border-radius: 2px;
      }
    }
  }

  #error-info {
    @include utils.useColorSet(error);
    margin-bottom: 8px;
    text-align: center;
    border-radius: 5px;
    padding: 0.5rem 2rem;
    font-size: 0.9rem;
    font-weight: 600;
  }
}
</style>
