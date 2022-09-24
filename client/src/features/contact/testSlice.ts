import { createSlice } from "@reduxjs/toolkit/dist/createSlice"

// จำไว้ให้ดี ว่าต้อง export นะ
export const testRTK = createSlice({
  name: 'test-rtk',
  initialState: {
    myname: 0
  },
  reducers: {
    incremented: state => {state.myname += 5555555555 },
    decremented: state => { state.myname -= 666666666 }
  }
})
// actions คือเมนูอาหาร
export const { incremented, decremented } = testRTK.actions
