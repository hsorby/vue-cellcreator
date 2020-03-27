<template>
  <div class="body">
    <div class="row">
      <Toolbox/>
      <div class="main">
        <MathArea/>
        <ModelArea/>
      </div>
    </div>
  </div>
</template>

<script>
  import Toolbox from "@/components/Toolbox";
  import MathArea from "@/components/MathArea";
  import ModelArea from "@/components/ModelArea";

export default {
  name: 'Body',
  components: {
    ModelArea,
    MathArea,
    Toolbox
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .row {
    display: flex;
    flex-wrap: wrap;
  }
  /* Main column */
  .main {
    flex: 70%;
    background-color: white;
    padding: 20px;
  }
</style>
