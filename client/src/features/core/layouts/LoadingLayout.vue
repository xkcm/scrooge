<template>
  <div id="app-loading-container">
    <div id="app-loading-spinner"></div>
  </div>
</template>

<style lang="scss">
@use "@/assets/styles/utils.scss";

body {
  overflow: hidden;
}

#app-loading-container {
  @include utils.useBgColor(alpha);
  width: 100%;
  height: 100vh;
  display: grid;
}

$spinnerRadius: 50px;
$borderWidth: 15px;
#app-loading-spinner {
  width: $spinnerRadius * 2;
  height: $spinnerRadius * 2;
  margin: auto;
  place-self: center;
  animation: loadingRotation infinite 1.5s linear;

  border-radius: 50%;
  border: $borderWidth solid utils.getColor(beta);
  border-left: $borderWidth solid transparent;
  border-right: $borderWidth solid transparent;
}

@keyframes loadingRotation {
  0% {
    rotate: 135deg;
  }
  100% {
    rotate: 495deg;
  }
}
</style>
