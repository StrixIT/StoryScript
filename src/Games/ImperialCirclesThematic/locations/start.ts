import { Location } from '../types';
import description from './Start.html?raw';
import { WarLocOne } from './WarLocOne';
import { CurLocOne } from './CurLocOne';
import { PovLocOne } from './PovLocOne';
import { GovLocOne } from './GovLocOne';
import { MigLocOne } from './MigLocOne';
import { BookMoser } from '../items/book_moser';
import { PersonNegker } from '../items/person_negker';

export function Start() {
    return Location({
        name: 'Start',
        description: description,
        features: [
            BookMoser(),
            PersonNegker()
        ],
        destinations: [
            {
                name: 'War & Defence',
                target: WarLocOne,
            },
            {
                name: 'Currencies & Fraud',
                target: CurLocOne,
            },
            {
                name: 'Poverty & Social Order',
                target: PovLocOne,
            },
            {
                name: 'Governance & Law',
                target: GovLocOne,
            },
            {
                name: 'Migration & Economies',
                target: MigLocOne,
            },
        ],
    });
}
