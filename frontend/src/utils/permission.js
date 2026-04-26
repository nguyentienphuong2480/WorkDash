export const getUser = () => {
  return JSON.parse(localStorage.getItem("user") || "{}");
};

export const hasRole = (...roles) => {
  const user = getUser();
  return roles.includes(user.role);
};