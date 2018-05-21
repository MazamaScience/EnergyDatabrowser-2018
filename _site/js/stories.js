// changes text in the html for a specific set of countries, otherwise shows default text
function country_stories() {
    switch(country_global) {
    case 'Indonesia':
        document.getElementById('story_text').innerHTML = "<p>Indonesia, was once a member of the powerful Oil and Petroleum Exporting countries and the oil production has decreased almost $1.2 Billion from 2012 to 2016. Though the country is rich in natural resources, getting necessary permissions and unpredictable regulations have created a slump in Oil production.</p><p> Indonesia is well supplied with medium and low-quality thermal coal. As Oil sources approached depletion, the government sought alternative sources of energy and the coal production soared exponentially. Indonesia is a major coal exporter to countries like India, China, Japan and South Korea and in 2014, the coal export was reported to be 24.4 trillion IDR, which was almost 85% of its GDP.</p>";
        break;
    case 'Egypt':
        document.getElementById('story_text').innerHTML = "<p>Egypt was an oil rich country, but its fossil fuels started depleting rapidly.The already declining production and an increasing population led to lower and lower oil exports over the years. In 2010, the Egyptian revolution happened and President Hosni Mubarak was overthrown.</p><p>The already declining oil production decreased further as companies stopped investing in Egypt. </p><p>Because of growing demand and limited supply, the Egyptian government was forced to import oil for the first time since 2010.</p>";
        break;
    case 'Sweden':
        document.getElementById('story_text').innerHTML = "<p>Sweden has set a national target to make the entire country run on renewable energy sources till 2040. Because of the oil crisis in 1970s and the decline in Oil production from the North Sea, Sweden began investing in Ethanol research, as an alternative fuel to oil. </p><p>Since then Sweden has been leveraging its limited population and vast land mass to invest in solar and wind energy. Even companies like IKEA have pledged to develop sustainable products to contribute to making Sweden a better place to live.</p>";
        break;
    case 'United Kingdom':
        document.getElementById('story_text').innerHTML = "<p>History of Coal Mining in UK goes back to the industrial revolution, when vast amounts of coal was produced. Coal mining was a social issue along with an economic issue. Most coal workers were left aligned and started forming socialist labor unions. The union protests became increasingly violent day by day and a lot of coal mines had to be closed. Coal production has now decreased rapidly, because of an emphasis on renewable energy sources.</p><p>Because of the decline in Oil prices in 1986 and the increasing cost of producing oil in the North Sea, the oil production declined. Oil production gradually started increasing, but then another Oil crisis happened in 1996 and the oil production again declined. Because of increased taxation in oil exploration in the North Sea and increasing costs, the oil production has been rapidly declining.</p>";
        break;
    case 'China':
        document.getElementById('story_text').innerHTML = "<p>The coal production in China has increased almost 400% since 1980 and is one of the largest coal producing countries in the world. Despite such high production, the consumption has also increased dramatically leading to import necessary resources from other countries. The oil consumption also plateaued since 2015 for the first time, indicating decreasing industrial output.</p>";
        break;
    default:
        document.getElementById('story_text').innerHTML = "<p>This graph shows the net energy import v/s export for the country you selected. It highlights the amount of energy a country has been importing or exporting since 1965.</p><p>You can see countries like UK, Indonesia, Sweden, China and Egypt which offers some interesting stories, explaining the changing energy trends in those countries. This data browser can be similarly leveraged to unearth stories of various countries around the world.</p>";
    }
}