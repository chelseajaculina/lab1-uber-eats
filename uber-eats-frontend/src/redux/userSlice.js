import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    updateUser: (state, action) => {
      // Update user logic here
    },
  },
});

export const { setUser, updateUser } = userSlice.actions;

export const selectuser = (state) => state.user.user;

export default userSlice.reducer;