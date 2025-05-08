let manager = 0;

export const setManager = (id) => {
    localStorage.setItem("manager", id);
};

export const getManager = () => {
    return parseInt(localStorage.getItem("manager"));
};
