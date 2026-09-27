-- Internal team desk: shared stock, enquiries, dispatches.
create table if not exists stock (
  id serial primary key,
  slug text not null unique,
  name text not null,
  technical text not null,
  category text not null,
  on_hand integer not null default 0 check (on_hand >= 0),
  reorder_at integer not null default 0 check (reorder_at >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists enquiries (
  id serial primary key,
  dealer text not null,
  phone text not null default '',
  product text not null,
  note text not null default '',
  status text not null default 'new' check (status in ('new','quoted','won','lost')),
  created_by text not null,
  created_at timestamptz not null default now()
);
create index if not exists enquiries_created_idx on enquiries (created_at desc);

create table if not exists dispatches (
  id serial primary key,
  stock_id integer not null references stock(id),
  qty integer not null check (qty > 0),
  destination text not null,
  created_by text not null,
  created_at timestamptz not null default now()
);
create index if not exists dispatches_created_idx on dispatches (created_at desc);

insert into stock (slug, name, technical, category) values ('mirhaj-super-505', 'Mirhaj Super-505', 'Chlorpyriphos 50% + Cypermethrin 5% EC', 'insecticide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('miraxima-plus', 'Miraxima Plus', 'Thiamethoxam 30% FS', 'insecticide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('miraxima', 'Miraxima', 'Thiamethoxam 25% WG', 'insecticide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('miroclaim', 'Miroclaim', 'Emamectin Benzoate 5% SG', 'insecticide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('panther', 'Panther', 'Lambda-cyhalothrin 4.9% CS', 'insecticide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('merofex-super', 'Merofex Super', 'Profenofos 40% + Cypermethrin 4% EC', 'insecticide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('mirogent-ultra', 'Mirogent Ultra', 'Fipronil 0.6% GR', 'insecticide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('mirogent', 'Mirogent', 'Fipronil 0.3% GR', 'insecticide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('virtus-sc', 'Virtus-SC', 'Fipronil 5% SC', 'insecticide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('informer', 'Informer', 'Thiamethoxam 12.6% + Lambda-cyhalothrin 9.5% ZC', 'insecticide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('mirida-super', 'Mirida Super', 'Imidacloprid 70% WG', 'insecticide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('miraj-super-25', 'Miraj Super-25', 'Cypermethrin 25% EC', 'insecticide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('gargee', 'Gargee', 'Dinotefuran 15% + Pymetrozine 45% WG', 'insecticide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('mitaaco', 'Mitaaco', 'Thiamethoxam 1.0% + Chlorantraniliprole 0.5% GR', 'insecticide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('kerogen', 'Kerogen', 'Chlorantraniliprole 18.5% SC', 'insecticide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('croma', 'Croma', 'Dinotefuran 20% SG', 'insecticide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('iconic', 'Iconic', 'Azoxystrobin 2.5% + Thiophanate Methyl 11.25% + Thiamethoxam 25% FS', 'insecticide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('futerra', 'Futerra', 'Chlorantraniliprole 0.4% GR', 'insecticide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('ballistic', 'Ballistic', 'Emamectin Benzoate 1.50% + Fipronil 3.5% SC', 'insecticide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('mirhaj-mida', 'Mirhaj Mida', 'Imidacloprid 17.8% SL', 'insecticide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('venza', 'Venza', 'Pymetrozine 50% WG', 'insecticide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('fighter', 'Fighter', 'Emamectin Benzoate 1.9% EC', 'insecticide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('comet', 'Comet', 'Bifenthrin 10% EC', 'insecticide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('sejjil', 'Sejjil', 'Chlorantraniliprole 9.3% + Lambda-cyhalothrin 4.6% ZC', 'insecticide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('cluster-75', 'Cluster-75', 'Thiamethoxam 75% SG', 'insecticide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('mentaf-plus', 'Mentaf Plus', 'Hexaconazole 5% SC', 'fungicide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('founder', 'Founder', 'Tebuconazole 10% + Sulphur 65% WG', 'fungicide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('haven', 'Haven', 'Azoxystrobin 11% + Tebuconazole 18.3% SC', 'fungicide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('mirostar-top', 'Mirostar Top', 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC', 'fungicide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('supreme', 'Supreme', 'Carbendazim 12% + Mancozeb 63% WP', 'fungicide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('jaishu', 'Jaishu', 'Azoxystrobin 8.3% + Mancozeb 66.7% WG', 'fungicide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('mizan', 'Mizan', 'Cymoxanil 8% + Mancozeb 64% WP', 'fungicide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('arena', 'Arena', 'Thiophanate Methyl 70% WP', 'fungicide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('miromycin', 'Miromycin', 'Validamycin 3% L', 'fungicide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('miroshine', 'Miroshine', 'Propiconazole 25% EC', 'fungicide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('mirostar', 'Mirostar', 'Azoxystrobin 23% SC', 'fungicide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('innovator', 'Innovator', 'Sulphur 80% WDG', 'fungicide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('mirajo-star', 'Mirajo Star', 'Paclobutrazol 23% SC', 'pgr') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('mirajo-star-gold', 'Mirazo Star Gold', 'Paclobutrazol 40% SC', 'pgr') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('tambut', 'Tambut', 'Tembotrione 34.4% SC', 'herbicide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('mizura', 'Mizura', '2,4-D Amine Salt 58% SL', 'herbicide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('mira-71', 'Mira-71', 'Ammonium salt of glyphosate 71% SG', 'herbicide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('pound-up', 'Pound Up', 'Glyphosate 41% SL', 'herbicide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('cleaner-38', 'Cleaner-38', '2,4-D Ethyl Ester 38% EC', 'herbicide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('mirexon', 'Mirexon', 'Paraquat Dichloride 24% SL', 'herbicide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('ekaiv', 'Ekaiv', 'Pyroxasulfone 85% WG', 'herbicide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('stranger', 'Stranger', 'Clodinafop Propargyl 9% + Metribuzin 20% WP', 'herbicide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('mifit-plus', 'Mifit Plus', 'Pretilachlor 37% EW', 'herbicide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('pendency', 'Pendency', 'Pendimethalin 30% EC', 'herbicide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('mifit', 'Mifit', 'Pretilachlor 50% EC', 'herbicide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('jaishu-gold', 'Jaishu Gold', 'Bispyribac Sodium 10% SC', 'herbicide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('met-on', 'Met-On', 'Metsulfuron Methyl 20% WP', 'herbicide') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('planner', 'Planner', 'Gibberellic acid 0.001% L', 'pgr') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('speeder', 'Speeder', 'Silicon spreader', 'pgr') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('facilitator', 'Facilitator', 'Humic acid 12% + Fulvic acid 6%', 'pgr') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('controller', 'Controller', 'Granulated organic manure', 'pgr') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('pookie-zyme', 'Pookie Zyme', 'Growth promoter granules', 'pgr') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('pookie-zyme-gold', 'Pookie Zyme Gold', 'Bio-stimulant granules', 'pgr') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('miracle', 'Miracle', 'Granulated organic potash', 'pgr') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('glory-carbon', 'Glory Carbon', 'Carbon fertilizer', 'pgr') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('faster', 'Faster', 'Humic acid 98% WSF', 'pgr') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('myrocin', 'Myrocin', 'Bio antibiotic · immune modulator', 'pgr') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('changer', 'Changer', 'Calcium chloride', 'pgr') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('hygeia-potash-ultra', 'Hygeia Potash Ultra', 'Organic potash · flowering stimulant', 'pgr') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('meribion', 'Meribion', 'Amino acid 65–68%', 'pgr') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('bio-rc305', 'Bio-RC305', 'Botanical extract biostimulant', 'pgr') on conflict (slug) do nothing;
insert into stock (slug, name, technical, category) values ('deccan', 'Deccan', 'Bio-extract insect controller', 'pgr') on conflict (slug) do nothing;
