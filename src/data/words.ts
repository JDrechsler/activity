import type { WordCard } from '../types/game'
import { animals } from './categories/animals'
import { food } from './categories/food'
import { popculture } from './categories/popculture'
import { sports } from './categories/sports'
import { tech } from './categories/tech'
import { travel } from './categories/travel'
import { professions } from './categories/professions'
import { emotions } from './categories/emotions'

export const words: WordCard[] = [
  ...animals,
  ...food,
  ...popculture,
  ...sports,
  ...tech,
  ...travel,
  ...professions,
  ...emotions,
]
