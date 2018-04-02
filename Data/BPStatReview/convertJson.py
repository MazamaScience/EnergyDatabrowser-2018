import pandas as pd 
import os
import json

def main():
    json_object = {}
    files = os.listdir('.')
    stat_review = [f for f in files if '2017' in f and f.endswith('.csv')]
    #
    for f in stat_review:
        print f
        df = pd.read_csv(f, skiprows = 5)
        f = f.replace('.csv', '')
        f = f.replace('BP_2017_', '')
        names = f.split('_')
        #Getting data from filename
        state = names[0]
        category = names[1]
        unit = names[2]
        new_key = json_object.setdefault(unit, {})
        new_key = json_object[unit].setdefault(state, {})
        countries = df.columns[1:]
        #
        for country in countries:
            new_key = json_object[unit][state].setdefault(country, {})
            for i in df.index:
                year = df.loc[i, 'YEAR']
                new_key = json_object[unit][state][country].setdefault(year, {})
                new_key = json_object[unit][state][country][year].setdefault(category, {})
                value = df.loc[i, country]
                if value == 'na':
                    value = 0
                json_object[unit][state][country][year][category] = float(value)

    with open('bp_stat_review_2017_combined.json', 'w') as fp:
        json.dump(json_object, fp, indent = 2)


if __name__ == "__main__":
    main()