import CoinCard from '../components/CoinCard';


const CoinScreen = ({route}) => {
    
    const data = route.params.data

    return (
        <CoinCard data={data} fetchPortfolioData={()=>{}}  />
    )
}

export default CoinScreen
