<template>
  <div>
    <v-row no-gutters>
      <v-col>
        <p id="dashboardTitle">Dashboard</p>
      </v-col>
    </v-row>
    <table-component />
  </div>
</template>

<script>
import TableComponent from "./TableComponent.vue";
export default {
  components: { TableComponent },
};
</script>

<style>
  #dashboardTitle{
    color: #009AA4;
    font-weight: 600;
    text-align: left;
    font-size: 64px;
  }
</style>