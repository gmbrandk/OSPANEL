# ==========================================
# Script: setup-form-ingreso.ps1
# Ruta esperada: C:\Users\DELL\formulario-ingreso
# ==========================================

Write-Host "Configurando estructura 'form-ingreso' en src..."

# Ruta base
$base = "src"

# Crear carpetas base
$folders = @(
    "$base/components/form-ingreso",
    "$base/hooks/form-ingreso",
    "$base/styles/form-ingreso",
    "$base/assets/form-ingreso",
    "$base/__mock__/form-ingreso",
    "$base/docs"
)

foreach ($folder in $folders) {
    if (-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Force -Path $folder | Out-Null
        Write-Host "Creada carpeta: $folder"
    } else {
        Write-Host "Ya existe: $folder"
    }
}

# Crear componentes
$componentFiles = @(
    "Collapsible.jsx",
    "Autocomplete.jsx",
    "FormIngreso.jsx",
    "ClienteSection.jsx",
    "EquipoSection.jsx",
    "FichaTecnica.jsx",
    "OrdenServicio.jsx",
    "LineaServicio.jsx",
    "index.js"
)

foreach ($file in $componentFiles) {
    $path = "$base/components/form-ingreso/$file"
    if (-not (Test-Path $path)) {
        New-Item -ItemType File -Force -Path $path | Out-Null
        Add-Content -Path $path -Value "// $file - componente del formulario de ingreso"
        Write-Host "Creado componente: $file"
    }
}

# Crear hooks
$hookFiles = @(
    "useAutocomplete.js",
    "useCollapsible.js",
    "useLineasServicio.js"
)

foreach ($file in $hookFiles) {
    $path = "$base/hooks/form-ingreso/$file"
    if (-not (Test-Path $path)) {
        New-Item -ItemType File -Force -Path $path | Out-Null
        Add-Content -Path $path -Value "// $file - hook del formulario de ingreso"
        Write-Host "Creado hook: $file"
    }
}

# Crear estilos
$styleFiles = @(
    "base.css",
    "layout.css",
    "fieldset.css",
    "inputs.css",
    "buttons.css",
    "linea-servicio.css",
    "autocomplete.css",
    "telefono.css",
    "main.css"
)

foreach ($file in $styleFiles) {
    $path = "$base/styles/form-ingreso/$file"
    if (-not (Test-Path $path)) {
        New-Item -ItemType File -Force -Path $path | Out-Null
        Add-Content -Path $path -Value "/* $file - estilos del formulario de ingreso */"
        Write-Host "Creado estilo: $file"
    }
}

# Crear mocks
$mockFiles = @(
    "clientes.js",
    "equipos.js",
    "tecnicos.js",
    "tipos-trabajo.js",
    "index.js"
)

foreach ($file in $mockFiles) {
    $path = "$base/__mock__/form-ingreso/$file"
    if (-not (Test-Path $path)) {
        New-Item -ItemType File -Force -Path $path | Out-Null
        Add-Content -Path $path -Value "// $file - mock de datos"
        Write-Host "Creado mock: $file"
    }
}

# Crear asset
$assetFile = "$base/assets/form-ingreso/dropdown-arrow.svg"
if (-not (Test-Path $assetFile)) {
    New-Item -ItemType File -Force -Path $assetFile | Out-Null
    Add-Content -Path $assetFile -Value "<svg><!-- dropdown arrow icon --></svg>"
    Write-Host "Creado asset: dropdown-arrow.svg"
}

# Crear documentación
$docFile = "$base/docs/form-ingreso.md"
if (-not (Test-Path $docFile)) {
    New-Item -ItemType File -Force -Path $docFile | Out-Null
    Add-Content -Path $docFile -Value "# Documentacion: Formulario de Ingreso`r`n`r`nEstructura, hooks y componentes principales."
    Write-Host "Creado documento: form-ingreso.md"
}

Write-Host ""
Write-Host "Estructura creada exitosamente."
Write-Host "Ubicacion: $PWD"
