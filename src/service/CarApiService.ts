import { Car } from '@/type/Car.ts'

const BACKEND_SERVER = 'http://localhost:8080'

export async function apiGetCars() {
  return await (await fetch(`${BACKEND_SERVER}/cars`)).json()
}

export async function apiSaveCar(newCar: Car) {
  await fetch(`${BACKEND_SERVER}/cars`, {
    method: 'POST',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newCar),
  })
}

export async function apiDeleteCar(carId: number) {
  await fetch(`${BACKEND_SERVER}/cars/${carId}`, {
    method: 'DELETE',
  })
}

export async function apiUpdateCar(carId: number, updatedCar: Car) {
  await fetch(`${BACKEND_SERVER}/cars/${carId}`, {
    method: 'PUT',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedCar),
  })
}
