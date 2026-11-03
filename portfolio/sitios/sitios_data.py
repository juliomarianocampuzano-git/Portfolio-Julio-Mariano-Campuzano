# sitios_data.py · une los 20 sitios demo en el orden en que aparecen en la galeria.
import sitios_a, sitios_b, sitios_c

SITES = sitios_a.SITES + sitios_b.SITES + sitios_c.SITES
assert len({s['slug'] for s in SITES}) == len(SITES), 'slugs repetidos'
