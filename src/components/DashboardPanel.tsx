import {
    Chart,
    Title,
    XAxis,
    YAxis,
    Legend,
    Tooltip,
    PlotOptions
} from '@highcharts/react';
import { ColumnSeries } from '@highcharts/react/series/Column';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';


type Campaings = {
    budget: number
    client: string
    currency: string
    endDate: string
    id: number
    name: string
    spent: number
    startDate: string
    status: string
    type: string
}

type ColumnBasicChartProps = {

    cliente: string
    filteredCampaigns: Campaings[]

}

export default function ColumnBasicChart({filteredCampaigns, cliente} : ColumnBasicChartProps) {

    const campaignNames = filteredCampaigns.map(item => item.name);
    const campaignBudgets = filteredCampaigns.map(item => item.budget || 0);
    const campaignSpents = filteredCampaigns.map(item => item.spent || 0);

    console.log(filteredCampaigns)
    console.log('Campaign names:', campaignNames)
    console.log('Budgets:', campaignBudgets)
    return (

        <div >
        <Chart spacing={20} backgroundColor='#4d4c4c'>
            <Title align="left" style={{padding: "10px"}}>
               {`Presupuesto por campañas de ${cliente}`}
            </Title>
            <XAxis
                categories={campaignNames}
                crosshair={true}
                accessibility={{ description: 'Campañas' }}>
                {cliente === "Todos los clientes" ? "Campañas" : `Campañas de ${cliente}`}
            </XAxis>
            <YAxis min={0} accessibility={{ description: 'Campañas' }}>Presupuesto</YAxis>
            <Legend symbolRadius={3} />
            <Tooltip
                shared={true}
                valueSuffix=" ARS"
                headerFormat="<table><caption>{point.key}</caption>"
                pointFormat={`
                <tr>
                  <th>
                    <svg width="20" height="10">
                      <rect x="5" y="0" width="10" height="10" rx="3" ry="3"
                          fill="{series.color}" />
                    </svg>
                    {series.name}
                  </th>
                  <td>{point.y}</td>
                </tr>
                `}
                footerFormat="</table>"
            />
            <PlotOptions column={{ pointPadding: 0.1, borderWidth: 0 }} />
            <ColumnSeries
                name="Presupuesto"
                data={campaignBudgets}
            />
            <ColumnSeries
                color={"red"}
                name="Gastado"
                data={campaignSpents}
            />
            <Exporting />
            <Accessibility />
        </Chart>
        </div>
    );
}
