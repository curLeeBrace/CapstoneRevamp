

interface useHandleChangeProps {
    event: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>
    setFormStateData : React.SetStateAction<any>;

}
const useHandleChange = ({event, setFormStateData} : useHandleChangeProps) => {
  const { name, value, type } = event.target;
  const newValue = type === "number" ? Math.max(0, parseFloat(value)) : value;
  
    // console.log(name , " ", value);
    setFormStateData((prev : any) => {
      return {
        ...prev, [name]:newValue
      }
    })
  }


  export default useHandleChange