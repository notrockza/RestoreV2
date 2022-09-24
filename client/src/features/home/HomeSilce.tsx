import { createSlice } from "@reduxjs/toolkit"


// จำไว้ให้ดี ว่าต้อง export นะ
export const HomeSilce = createSlice({
  name: 'screen',
  initialState: {
    fullscreen: true
  },
  reducers: {
    setscreen: (state ) => {state.fullscreen = !state.fullscreen},
  
  }
})
// actions คือเมนูอาหาร
export const { setscreen } = HomeSilce.actions
