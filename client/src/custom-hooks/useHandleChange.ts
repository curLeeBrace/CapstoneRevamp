

interface useHandleChangeProps {
    event: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>
    setFormStateData : React.SetStateAction<any>;

}
const useHandleChange = ({event, setFormStateData} : useHandleChangeProps) => {
    const name = event.target.name;
    const value = event.target.value;

    console.log(name , " ", value);
    setFormStateData((prev : any) => {
      return {
        ...prev, [name]:value
      }
    })
  }


  export default useHandleChange