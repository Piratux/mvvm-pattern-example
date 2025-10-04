<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import PiOverlay from '@/component/PiOverlay.vue'
import PiCardContainer from '@/component/PiCardContainer.vue'
import PiTextField from '@/component/PiTextField.vue'
import { VForm } from 'vuetify/components'
import { Car } from '@/type/Car.ts'
import { apiDeleteCar, apiGetCars, apiSaveCar, apiUpdateCar } from '@/service/CarApiService.ts'

const cars = ref<Car[]>([])
const showAddPopup = ref(false)
const loadingOverlay = ref(false)
const newCar = ref<Car>({ id: 0, name: '', year: '', fuel: '', price: 1000 })
const editingIndex = ref<number | null>(null)

const form = ref<VForm>()

// Generate a list of years from 1980 to current year
const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: currentYear - 1980 + 1 }, (_, i) => (1980 + i).toString())

onMounted(async () => {
  cars.value = await apiGetCars()
})

function resetNewCar() {
  newCar.value = { id: 0, name: '', year: '', fuel: '', price: 1000 }
}

function openAddDialog() {
  editingIndex.value = null
  resetNewCar()
  showAddPopup.value = true
}

function openEditDialog(idx: number) {
  editingIndex.value = idx
  newCar.value = { ...cars.value[idx] }
  showAddPopup.value = true
}

async function saveCar() {
  if (!(await form.value!.validate()).valid) {
    return
  }

  if (editingIndex.value === null) {
    await apiSaveCar(newCar.value)
  } else {
    await apiUpdateCar(cars.value[editingIndex.value].id, newCar.value)
  }

  cars.value = await apiGetCars()

  showAddPopup.value = false
}

async function deleteCar(index: number) {
  await apiDeleteCar(cars.value[index].id)
  cars.value = await apiGetCars()
}

function handleCancel() {
  showAddPopup.value = false
  editingIndex.value = null
  resetNewCar()
}
</script>

<template>
  <PiOverlay :loading="loadingOverlay"></PiOverlay>
  <PiCardContainer>
    <h2>Keep a list of your favorite cars!</h2>

    <v-btn color="blue" @click="openAddDialog">Add</v-btn>
    <v-table>
      <thead>
        <tr>
          <th>Car Name</th>
          <th>Year</th>
          <th>Fuel</th>
          <th>Price (€)</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in cars" :key="item.name + item.year">
          <td>{{ item.name }}</td>
          <td>{{ item.year }}</td>
          <td>{{ item.fuel }}</td>
          <td>{{ item.price }}</td>
          <td>
            <v-btn icon color="primary" @click="openEditDialog(idx)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon color="red" @click="deleteCar(idx)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-dialog v-model="showAddPopup" persistent max-width="400">
      <v-card>
        <v-form ref="form" autocomplete="on" validate-on="submit lazy" @submit.prevent="saveCar">
          <v-card-title>{{ editingIndex === null ? 'Add a new car' : 'Edit car' }}</v-card-title>
          <v-card-text>
            <PiTextField v-model="newCar.name" :required="true" label="Car Name" />
            <v-select
              v-model="newCar.year"
              :items="yearOptions"
              label="Year"
              :rules="[(v) => !!v || 'Year is required']"
              :required="true"
              clearable
            />
            <v-select
              v-model="newCar.fuel"
              :items="['Petrol', 'Diesel', 'Electric', 'Hybrid']"
              label="Fuel"
              :rules="[(v) => !!v || 'Fuel is required']"
              :required="true"
              clearable
            />
            <PiTextField
              v-model="newCar.price"
              :required="true"
              :rules="[(v) => (v !== '' && v >= 0) || 'Price must be a non-negative number']"
              label="Price (€)"
              type="number"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn color="green" type="submit">{{ editingIndex === null ? 'Add' : 'Save' }}</v-btn>
            <v-btn text @click="handleCancel()">Cancel</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </PiCardContainer>
</template>
