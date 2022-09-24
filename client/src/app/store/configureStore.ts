
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { counterSlice} from "../../features/contact/counterSlice"; 
import { HomeSilce } from '../../features/home/HomeSilce';
import basketSlice from '../../features/basket/basketSlice';
import catalogSlice  from '../../features/catalog/catalogSlice';


// store เป็นการรวบรวมพ่อครัว
export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    screen : HomeSilce.reducer,
    basket : basketSlice,
    catalog : catalogSlice
  }

    
  })

//เป็นค่า Default ที่มีอยู่ใน store คือ store.getState, store.dispatch (ใช้ตามรูปแบบเขาเลย)
export type RootState = ReturnType<typeof store.getState>	// ค่าของ state ทั้งหมด
export type AppDispatch = typeof store.dispatch;			// dispatch สำหรับเรียก action

//สำหรับเรียกใข้ dispatch และ state (ใช้ตามรูปแบบเขาเลย)
 export const useAppDispatch = ()=>useDispatch<AppDispatch>()
 export const useAppSelector : TypedUseSelectorHook<RootState> = useSelector