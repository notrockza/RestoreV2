import { createSlice } from "@reduxjs/toolkit"


// จำไว้ให้ดี ว่าต้อง export นะ
export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    num: 0
  },
  reducers: {
    incremented: (state , action) => {state.num += action.payload},
    decremented: (state , action) => { state.num -= action.payload}, 
  }
})
// actions คือเมนูอาหาร
export const { incremented, decremented } = counterSlice.actions;

