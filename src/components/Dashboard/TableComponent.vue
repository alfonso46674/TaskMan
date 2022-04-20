<template>
  <!-- TODO separate the seach bar into another component, and put it in the taskDashboard -->
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
        <tr v-for="item in filteredList" :key="item" @click="goToTaskInformation(item.id)">
          <td v-for="header in headers" :key="header.nameToDisplay">
            {{ item[header.jsonId] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { sortBy, } from "lodash";
import { ref, computed } from "vue";
import {useRouter} from 'vue-router'

export default {
  setup() {
    //TODO Create a store and move this variables with data to there
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
        jsonId: "dateToDisplay",
      },
      {
        nameToDisplay: "Last Modified Date",
        jsonId: "lastModifiedDateToDisplay",
      },
      {
        nameToDisplay: "Status",
        jsonId: "status",
      },
    ];

const data = [
      {
        id: 1,
        task:"8057",
        priority: 1,
        dateToDisplay: "2022-4-20",
        dateTimeStamp: new Date("2022-4-20").getTime(),
        lastModifiedDateToDisplay: "2022-1-1",
        lastModifiedDateTimeStamp:new Date("2022-1-1").getTime() ,
        status: "Active",
      },
      {
        id: 2,
        task: "8001",
        priority: 4,
        dateToDisplay: "2022-5-2",
        dateTimeStamp:new Date().getTime(),
        lastModifiedDateToDisplay: "2022-11-22",
        lastModifiedDateTimeStamp: new Date().getTime(),
        status: "Active",
      },
      {
        id: 3,
        task: "8054",
        priority: 2,
        dateToDisplay: "2021-3-20",
        dateTimeStamp:new Date("2021-3-20").getTime(),
        lastModifiedDateToDisplay: "2022-8-12",
        lastModifiedDateTimeStamp: new Date("2022-8-12").getTime(),
        status: "Active",
      },
      {
        id: 6,
        task: "3598",
        priority: 1,
        dateToDisplay: "2019-4-24",
        dateTimeStamp:new Date("2019-4-24").getTime(),
        lastModifiedDateToDisplay: "2022-3-2",
        lastModifiedDateTimeStamp: new Date("2022-3-2").getTime(),
        status: "Pending",
      },
      {
        id: 5,
        task: "4569",
        priority: 1,
        dateToDisplay: "2022-5-18",
        dateTimeStamp:new Date("2022-5-18").getTime(),
        lastModifiedDateToDisplay: "2020-4-20",
        lastModifiedDateTimeStamp: new Date("2020-4-20").getTime(),
        status: "Finished",
      },
    ];

    let router = useRouter()

    let sort = ref(false);
    let updatedList = ref([]);
    let searchQuery = ref("");

    //TODO Sort by default ascending, if clicked then descending
    //function to sort the table
    const sortTable = (column) => {
      sort.value = true;

      //check to see if the column to sort is one of the two that involve dates, if so, sort them by timestamp instead of a readable date
      if(column == 'dateToDisplay'){
        updatedList.value = sortBy(data, 'dateTimeStamp');
      }
      else if(column == 'lastModifiedDateToDisplay'){
        updatedList.value = sortBy(data, 'lastModifiedDateTimeStamp');
      }

      else  {
        updatedList.value = sortBy(data, column);
      } 
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

    //move to the task route to display its information
    const goToTaskInformation = (taskId) => {
      console.log(taskId)
      router.push(`/task/${taskId}`)
    }

    return {
      headers,
      data,
      searchQuery,
      sortedList,
      sortTable,
      filteredList,
      goToTaskInformation
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