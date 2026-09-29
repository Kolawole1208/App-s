const register = async (userData) => {
  try {
    const { data } = await authAPI.register(userData);
    if (data.success) {
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return { success: true };
    } else {
      return {
        success: false,
        error: data.message || 'Registration failed'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.response?.data?.error || 'Registration failed'
    };
  }
};