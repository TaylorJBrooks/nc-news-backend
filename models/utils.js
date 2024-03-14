exports.getLimit = (limit = false, page = 1) => {
    if(limit === false){
        return 'no limit';
    }

    
    let numPerPage = 0;
    
    if (limit === "") {
        numPerPage += 10;
    } else if (limit >= 0) {
        numPerPage += limit*1;
    } else {
        return 'error'
    }
    
    let offset = 0;
    
    if (+page > 1) {
        offset += numPerPage * (page - 1);
    } else if (+page === 1) {
        offset += 0;
    } else {
        return 'error'
    }

    return {numPerPage, offset}
}