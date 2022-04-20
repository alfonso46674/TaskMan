<template>
  <!-- TODO separate the seach bar into another component -->
  <div class="rootDiv">
    <div class="searchBar">
      <div class="input-group mb-5">
        <input
          type="search"
          class="form-control"
          v-model="searchQuery"
          placeholder="Task's Name"
        />
      </div>
    </div>

    <table
      id="tableComponent"
      class="table table-bordered table-striped table-hover table-responsive"
    >
      <thead>
        <th
          v-for="header in headers"
          :key="header.nameToDisplay"
          @click="sortTable(header.jsonId)"
        >
          <div>
            {{ header.nameToDisplay }}
            <font-awesome-icon icon="sort" />
          </div>
        </th>
      </thead>
      <tbody>
        <tr v-for="item in filteredList" :key="item">
          <td v-for="header in headers" :key="header.nameToDisplay">
            {{ item[header.jsonId] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { sortBy } from "lodash";
import { ref, computed } from "vue";

export default {
  setup() {
    const headers = [
      {
        nameToDisplay: "Task",
        jsonId: "task",
      },
      {
        nameToDisplay: "Priority",
        jsonId: "priority",
      },
      {
        nameToDisplay: "Date",
        jsonId: "date",
      },
      {
        nameToDisplay: "Last Modified Date",
        jsonId: "lastModifiedDate",
      },
      {
        nameToDisplay: "Status",
        jsonId: "status",
      },
    ];

    const data = [
      {
        id: 1,
        task: "8057",
        priority: 1,
        date: "03/04/2021",
        lastModifiedDate: "02/04/2022",
        status: "Active",
      },
      {
        id: 2,
        task: "8001",
        priority: 4,
        date: "10/04/2022",
        lastModifiedDate: "02/04/2022",
        status: "Active",
      },
      {
        id: 3,
        task: "8054",
        priority: 2,
        date: "02/04/2022",
        lastModifiedDate: "02/04/2022",
        status: "Active",
      },
      {
        id: 4,
        task: "3598",
        priority: 1,
        date: "02/04/2022",
        lastModifiedDate: "02/04/2022",
        status: "Pending",
      },
      {
        id: 5,
        task: "4569",
        priority: 1,
        date: "02/04/2022",
        lastModifiedDate: "02/04/2022",
        status: "Finished",
      },
    ];

    let sort = ref(false);
    let updatedList = ref([]);
    let searchQuery = ref("");

    //function to sort the table
    const sortTable = (column) => {
      sort.value = true;
      updatedList.value = sortBy(data, column);
    };

    //checks if a column has been sorted
    const sortedList = computed(() => {
      if (sort.value) {
        return updatedList.value;
      } else {
        return data;
      }
    });

    //filter search
    const filteredList = computed(() => {
      return sortedList.value.filter((item) => {
        return (
          item.task.toLowerCase().indexOf(searchQuery.value.toLowerCase()) != -1
        );
      });
    });

    return {
      headers,
      data,
      searchQuery,
      sortedList,
      sortTable,
      filteredList,
    };
  },
};
</script>

<style scoped>
table th:hover {
  background: #f2f2f2;
}

table th {
  text-align: center;
  vertical-align: middle;
}
</style>