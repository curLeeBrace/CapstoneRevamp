import { useState, useEffect } from 'react';

const useSearchFilter = (tb_data: any[][] = [], searchQuery: string) => {
  const [filteredData, setFilteredData] = useState<any[][]>([]);

  useEffect(() => {
    const filtered = tb_data.filter((row) => 
      searchQuery === "" || row[0].toString().includes(searchQuery)
    );
    setFilteredData(filtered);
  }, [searchQuery, tb_data]);

  return filteredData;
};

export default useSearchFilter;
