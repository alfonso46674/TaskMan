<template>
  <table id="tableComponent" class="table table-bordered table-striped table-hover table-responsive">
      <thead>
          <th v-for="header in headers" :key="header.nameToDisplay" @click="sortTable(header.jsonId)">
            <div>
                {{header.nameToDisplay}} 
                <font-awesome-icon  icon="sort" />
            </div>
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

        const sortTable = (header) => {
            console.log(header)
        }
        return {
            headers,
            data,
            sortTable
        }
    }
}
</script>

<style>
table th:hover {
        background:#f2f2f2;
      }

table th {
    text-align: center;
    vertical-align: middle;
}

</style>