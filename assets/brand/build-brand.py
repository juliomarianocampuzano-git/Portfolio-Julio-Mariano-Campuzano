#!/usr/bin/env python3
"""Genera los PNG/JPG de marca (logo, iconos, imagen para compartir) a partir de la misma geometria del icono SVG.
Uso: python assets/brand/build-brand.py   (necesita Pillow)"""
import os,random
from PIL import Image,ImageDraw,ImageFont
here=os.path.dirname(os.path.abspath(__file__));root=os.path.dirname(os.path.dirname(here))
INK=(28,20,51);MANGO=(255,107,44);SUN=(255,197,61);PINK=(255,62,138);MINT=(20,200,154);SKY=(47,123,255);GRAPE=(123,77,255);CREAM=(255,248,239);WHITE=(255,255,255)
BRIC=os.path.join(root,'assets/fonts/bricolage.woff2');SCHI=os.path.join(root,'assets/fonts/schibsted.woff2')
def font(path,size,wght):
    f=ImageFont.truetype(path,size)
    try:f.set_variation_by_axes([96,wght] if 'bricolage' in path else [wght])
    except Exception:pass
    return f

import math
def bubble_pts():
    """mismo contorno que el path del SVG (viewBox 64): rect redondeado r9 con cola abajo a la izquierda"""
    pts=[]
    def arc(cx,cy,a0,a1):
        for i in range(13):a=math.radians(a0+(a1-a0)*i/12);pts.append((cx+9*math.cos(a),cy+9*math.sin(a)))
    arc(47,14,-90,0);arc(47,39,0,90);pts+=[(27,48),(16,57),(16,48)];arc(13,39,90,180);arc(13,14,180,270)
    return pts
BUB=bubble_pts()
def bubble(d,ox,oy,s,fill,outline=None,w=0):
    pts=[(ox+x*s,oy+y*s) for x,y in BUB]
    d.polygon(pts,fill=fill)
    if outline:d.line(pts+pts[:2],fill=outline,width=int(w),joint='curve')

def icon(img,ox,oy,size):
    s=size/64;d=ImageDraw.Draw(img)
    P=lambda x,y:(ox+x*s,oy+y*s)
    # sombra dura
    bubble(d,ox+3*s,oy+3*s,s,INK)
    bubble(d,ox,oy,s,MANGO,INK,3*s)
    # M
    pts=[P(18,39),P(18,20),P(30,33),P(42,20),P(42,39)]
    w=int(6.5*s);d.line(pts,fill=WHITE,width=w,joint='curve')
    for p in (pts[0],pts[-1]):d.ellipse([p[0]-w/2,p[1]-w/2,p[0]+w/2,p[1]+w/2],fill=WHITE)
    # sol
    c=P(52,11);r=7*s;d.ellipse([c[0]-r,c[1]-r,c[0]+r,c[1]+r],fill=SUN,outline=INK,width=int(3*s))

def ss(fn,w,h,bg,scale=4):
    """dibuja en grande y reduce: bordes suaves"""
    big=Image.new('RGBA',(w*scale,h*scale),bg);fn(big,scale);return big.resize((w,h),Image.LANCZOS)

def save_icons():
    for name,px,pad,bg in (('apple-touch-icon.png',180,.12,CREAM+(255,)),('assets/brand/icono-192.png',192,.1,CREAM+(255,)),('assets/brand/icono-512.png',512,.1,CREAM+(255,)),('assets/brand/icono-transparente-1024.png',1024,.04,(0,0,0,0))):
        def fn(im,k,px=px,pad=pad):icon(im,px*k*pad,px*k*pad,px*k*(1-2*pad)*64/60)
        ss(fn,px,px,bg).save(os.path.join(root,name))

def logo(path,txt_color,tag_color,bg,vertical=False):
    W,H=(1400,1100) if vertical else (2600,620)
    def fn(im,k):
        d=ImageDraw.Draw(im)
        f1=font(BRIC,int((150 if vertical else 190)*k),800);f2=font(SCHI,int((58 if vertical else 64)*k),700)
        if vertical:
            icon(im,(W/2-230)*k,60*k,460*k)
            for txt,f,y,col in (('Mariano Campuzano',f1,590,txt_color),('AUTOMATIZACIÓN CON IA',f2,820,tag_color)):
                tw=d.textlength(txt,font=f);d.text((W*k/2-tw/2,y*k),txt,font=f,fill=col)
        else:
            icon(im,20*k,30*k,560*k)
            d.text((650*k,120*k),'Mariano Campuzano',font=f1,fill=txt_color)
            d.text((660*k,380*k),'AUTOMATIZACIÓN CON IA',font=f2,fill=tag_color)
            # punto de marca
            d.ellipse([(660+d.textlength('AUTOMATIZACIÓN CON IA',font=f2)/k+30)*k,400*k,(660+d.textlength('AUTOMATIZACIÓN CON IA',font=f2)/k+70)*k,440*k],fill=PINK)
    ss(fn,W,H,bg,2).save(os.path.join(root,path))

def og():
    W,H=1200,630
    def fn(im,k):
        d=ImageDraw.Draw(im);rnd=random.Random(7)
        cols=[MANGO,SUN,PINK,MINT,SKY,GRAPE]
        for i in range(46):
            x,y=rnd.uniform(0,W),rnd.uniform(0,H)
            if 40<x<1170 and 110<y<570:continue
            c=cols[i%len(cols)];r=rnd.uniform(8,22)
            if i%3==0:d.ellipse([(x-r)*k,(y-r)*k,(x+r)*k,(y+r)*k],fill=c,outline=INK,width=3*k)
            elif i%3==1:d.rounded_rectangle([(x-r)*k,(y-r/2.4)*k,(x+r)*k,(y+r/2.4)*k],radius=r/2.4*k,fill=c,outline=INK,width=3*k)
            else:d.regular_polygon(((x*k,y*k),r*k),3,rotation=rnd.uniform(0,360),fill=c,outline=INK,width=3*k)
        icon(im,900*k,170*k,250*k)
        f1=font(BRIC,74*k,800);f2=font(SCHI,34*k,600);f3=font(SCHI,28*k,700)
        d.text((70*k,150*k),'Automatizá tu negocio',font=f1,fill=INK)
        d.text((70*k,250*k),'con IA.',font=f1,fill=MANGO)
        d.text((72*k,375*k),'Asistentes de WhatsApp, flujos y paneles',font=f2,fill=INK)
        d.text((72*k,420*k),'que trabajan solos. Desde Posadas, Misiones.',font=f2,fill=INK)
        d.rounded_rectangle([70*k,490*k,680*k,548*k],radius=29*k,fill=INK)
        d.text((100*k,503*k),'Mariano Campuzano · Diagnóstico gratis',font=f3,fill=SUN)
    ss(fn,W,H,CREAM+(255,),2).convert('RGB').save(os.path.join(root,'assets/img/og.jpg'),quality=88)

save_icons()
logo('assets/brand/logo-horizontal.png',INK,MANGO,(0,0,0,0))
logo('assets/brand/logo-horizontal-fondo-oscuro.png',CREAM,SUN,(0,0,0,0))
logo('assets/brand/logo-vertical.png',INK,MANGO,(0,0,0,0),True)
og()
print('ok')
