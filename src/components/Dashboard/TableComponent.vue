<template>
  <table id="tableComponent" class="table table-bordered table-striped table-hover table-responsive">
      <thead>
          <th v-for="header in headers" :key="header.nameToDisplay">
            {{header.nameToDisplay}}
          </th>
      </thead>
      <tbody>
          <tr v-for="item in data" :key="item">
              <td v-for="header in headers" :key="header.nameToDisplay">
                  {{item[header.jsonId]}}
              </td>
          </tr>
      </tbody>
  </table>
</template>

<script>
export default {
    setup(){
        const headers = [
            {
                nameToDisplay: "Task",
                jsonId: "task"
            },
            {
                nameToDisplay: "Priority",
                jsonId: "priority"
            },
            {
                nameToDisplay: "Date",
                jsonId: "date"
            },
            {
                nameToDisplay: "Last Modified Date",
                jsonId: "lastModifiedDate"
            },
            ]

        const data = [
            {
                id: 1,
                task: "8057",
                priority: 1,
                date: "02/04/2022",
                lastModifiedDate: "02/04/2022"
            },
            {
                id: 2,
                task: "8001",
                priority: 1,
                date: "02/04/2022",
                lastModifiedDate: "02/04/2022"
            },
            {
                id: 3,
                task: "8054",
                priority: 1,
                date: "02/04/2022",
                lastModifiedDate: "02/04/2022"
            },
            {
                id: 4,
                task: "3598",
                priority: 1,
                date: "02/04/2022",
                lastModifiedDate: "02/04/2022"
            },
            {
                id: 5,
                task: "4569",
                priority: 1,
                date: "02/04/2022",
                lastModifiedDate: "02/04/2022"
            },
        ]
        return {
            headers,
            data
        }
    }
}
</script>

<style>
 #tableComponent {
     /* margin: 0; */
     padding-right: 500px;
 }
</style>