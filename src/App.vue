<template>
  <div id="app">
    <NavBar/>
    <Body/>
  </div>
</template>

<script>
  import Body from "@/components/Body";
  import NavBar from "@/components/NavBar";

  export default {
    name: 'app',
    components: {
      NavBar,
      Body
    }
  }
</script>
