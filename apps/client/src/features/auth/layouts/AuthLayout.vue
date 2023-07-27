<template>
  <div id="auth-container">
    <div id="left-section">
      <div>
        <span id="app-title">
          <h1>Scrooge</h1>
        </span>
        <span id="app-subtitle">
          <h6>Start tracking your expenses <span>today</span>!</h6>
        </span>
      </div>
    </div>
    <div id="right-section">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
@use "@/assets/styles/utils.scss";

#auth-container {
  display: grid;
  grid-template-columns: 45.83% auto;
  min-height: 100vh;
}

#left-section {
  @include utils.useBgColor(alpha);
  display: flex;

  > div {
    display: flex;
    flex-direction: column;
    margin: auto;
    margin-top: 338px;
  }

  #app-title h1 {
    @include utils.useTextColor(primary);
  }

  #app-subtitle h6 {
    @include utils.useTextColor(primary);
    margin-top: 6px;
    > span {
      color: utils.getColor(delta);
    }
  }
}

#right-section {
  @include utils.useBgColor(alpha, 500);
  display: flex;
}
</style>
