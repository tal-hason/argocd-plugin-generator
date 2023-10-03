{{- define "app.name" -}}
{{ default .Release.Name .Values.global.nameOverride }}
{{- end -}}

{{- define "app.labels" -}}
{{ include "app.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/part-of: {{ include "app.name" . }}
app.kubernetes.io/managed-by: argocd
app.openshift.io/runtime: {{ .Values.global.runTime }}
{{- end }}

{{- define "app.selectorLabels" -}}
app.kubernetes.io/name: {{ include "app.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{- define "app.imageName" -}}
{{ default (include "app.name" .) .Values.image.name }}:{{ .Values.image.tag }}
{{- end -}}

{{- define "host.name" -}}
{{ .Values.global.serviceName }}-{{ .Values.global.nameOverride }}-{{ .Values.global.namespace }}.{{ .Values.deploy.ingress.Domain }}
{{- end -}}

{{- define "certificate.path" -}}
"Certificates/{{ .Values.global.nameOverride }}/*"
{{- end -}}