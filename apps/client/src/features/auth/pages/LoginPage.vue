<template>
  <AuthLayout>
    <form id="form-container" @on-submit.prevent>
      <h2>Welcome back!</h2>
      <span id="details-info">Log in to your Scrooge account</span>

      <TextInput id="mail-input" v-model="mail" placeholder="yourmail@mail.com">
        <template #icon>
          <Icon icon="mdi:email-outline" height="24" />
        </template>
      </TextInput>

      <PasswordInput
        id="password-input"
        v-model="password"
        placeholder="Your password"
      >
        <template #icon>
          <Icon icon="mdi:key-outline" height="24" />
        </template>
      </PasswordInput>

      <a id="forgot-password-text" href="#">I forgot my password</a>

      <FilledButton
        id="submit-button"
        caption="Log in"
        icon="mdi:sign-in"
        @click="submitForm(mail, password)"
      ></FilledButton>

      <span id="new-account-text">
        You don't have an account? <a href="#">Sign up</a>
      </span>
    </form>
  </AuthLayout>
</template>

<script setup lang="ts">
// todo: add form validation
import { ref } from "vue";
import { useRouter } from "vue-router";

import { Icon } from "@iconify/vue";

import AuthLayout from "../layouts/AuthLayout.vue";

import { FilledButton, PasswordInput, TextInput } from "@scrooge/ui-library";

import NotificationService from "@/features/notifications/notification.service";
import { NotificationWithActions } from "@/features/notifications/notification.types";

import { prepareNotificationInputFromApiError } from "@/features/notifications/notification.utils";
import { ApiError } from "@scrooge/shared";
import AuthService from "../auth.service";

const mail = ref("");
const password = ref("");

const router = useRouter();
let lastErrorNotification: NotificationWithActions | null = null;

const submitForm = async (mailValue: string, passwordValue: string) => {
  if (lastErrorNotification) {
    lastErrorNotification.dispose();
  }

  try {
    await AuthService.logIn(mailValue, passwordValue);

    router.push("dashboard");
    NotificationService.pushNotification({
      title: "You're logged in",
      type: "success",
    });
  } catch (apiError) {
    lastErrorNotification = NotificationService.pushNotification(
      prepareNotificationInputFromApiError(apiError as ApiError, {
        title: "Login attempt failed",
        duration: 1500000,
        onDispose: () => (lastErrorNotification = null),
      }),
    );
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
    @include utils.useTextColor(primary, 0.5);
    margin-left: 5px;
    margin-bottom: 16px;
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
    @include utils.useTextColor(primary, 0.5);
    margin-top: 32px;
    width: 100%;
    text-align: center;
    position: relative;

    &::before {
      @include utils.useBgColor(alpha, 600);
      @include utils.useTextColor(primary);
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
}
</style>
